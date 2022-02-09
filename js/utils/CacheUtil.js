import * as SQLiteUtil from "./SQLiteUtil";
import * as FileUtil from "./FileUtil";
import * as LoggerUtil from "./LoggerUtil";
import RNFetchBlob from 'rn-fetch-blob';
import Common from "./Common";
import DeviceStorageUtil from "./DeviceStorageUtil";

const FILE_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000 //文件过期时间
const CLEAR_ALL_CACHE_REGULAR_DAY = 1//清除全部缓存日期(周一)


export async function getDataCacheSize() {
    let arrData = []
    let arrTable = []
    let arrSelect = []
    for (const name of clearCacheTables) {
        let result = await SQLiteUtil.checkTableField(name, "STATUS")
        if (result) {
            let sql = "select * from " + name + " where STATUS = 'N'"
            // let sql = "select * from " + name
            let selectPromise = SQLiteUtil.selectData(sql).then(data => {
                let result = data
                result.table = name
                return result
            })
            arrSelect.push(selectPromise)

        }
    }
    await Promise.all(arrSelect).then(results => {
        for (const result of results) {
            if (result.length > 0) {
                let data = result.raw()
                arrData = arrData.concat(data)
                arrTable.push(result.table)//记录表格名称
            }
        }
    })
    let size = arrData.length > 0 ? getStringByteSize(JSON.stringify(arrData)) : 0
    let result = {
        size,
        arrTable: arrTable
    }
    return result
}

export async function getFileCacheSize() {
    let fileCacheSize = 0;
    let files = await RNFetchBlob.fs.lstat(FileUtil.APPFILE_DIR).catch(error => {
        console.log("getFileCacheSize error:",error);
        return []
    })
    for (const file of files) {
        fileCacheSize = parseInt(fileCacheSize) + parseInt(file.size)
    }
    return fileCacheSize
}

//获取字符串字节长度
function getStringByteSize(value) {
    if (typeof (value) == 'string') {
        let regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/;
        if (regEx.test(value)) {
            return value.length * 2;
        } else {
            let oMatches = value.match(/[\x00-\xff]/g);
            let oLength = value.length * 2 - oMatches.length;
            return oLength;
        }
    }
}
/**
 * 清除文件缓存
 */
export async function clearFileCache() {
    //删除APP文件表
    let sql = "delete from THF_APP_FILE"
    SQLiteUtil.deleteData(sql).then(data => {
        console.log("删除APP文件表资料成功");
    }).catch(error => {
        console.log("删除APP文件表资料失败:", error);
    })
    //删除APP文件夹全部文件
    let files = await RNFetchBlob.fs.lstat(FileUtil.APPFILE_DIR).catch(error => {
        console.log("clearFileCache error:",error);
        return []
    })
    if (files.length > 0) {
        for (const file of files) {
            let path = file.path
            RNFetchBlob.fs.unlink(path).then(() => {
                console.log("删除文件成功:");
            }).catch(error => {
                console.log("删除文件失败:", error);
            })
        }
    } else {
        console.log("没有文件需要删除");
    }
}
/**
 * 清除资料缓存
 */
export async function clearDataCache(arrTable) {
    if (arrTable == undefined) {
        arrTable = clearCacheTables
    }
    if (arrTable.length > 0) {
        for (const table of arrTable) {
            let sql = "delete from " + table + " where STATUS = 'N'"
            SQLiteUtil.deleteData(sql).then(result => {
                console.log("删除资料成功");
            }).catch(error => {
                console.log("删除资料失败:", error);
            })
        }
    } else {
        console.log("没有需要清除的资料");
    }

}

/**
 * 定期清理缓存资料和文件
 */
export async function clearAllCacheForRegular() {
    let result = await isClearCacheDay()
    if (result) {
        clearDataCache()
        clearFileCacheForRegular()
    } else {
        console.log("未到清除缓存日期");
    }
}
/**
 * 是否是清除缓存日期
 * 定期周一
 */
async function isClearCacheDay() {
    let result = false
    let clearCacheDateStr = await DeviceStorageUtil.get("clearCacheDate")//上次更新日期字串
    console.log("上次清除缓存日期:",clearCacheDateStr);
    let date = new Date()
    let dateStr = Common.dateFormatNoTime(date)
    if (clearCacheDateStr == "") {
        DeviceStorageUtil.set("clearCacheDate", dateStr)
        result = true
    } else {
        let clearCacheDate = new Date(clearCacheDateStr)//上次更新日期
        let clearCacheDay = clearCacheDate.getDay() == 0 ? 7 : clearCacheDate.getDay()//周日转换为7
        let apartClearCacheDate = 7 + CLEAR_ALL_CACHE_REGULAR_DAY - clearCacheDay//与下次更新相隔日期
        let nextClearCacheDate = clearCacheDate.setDate(clearCacheDate.getDate() + apartClearCacheDate)//下次更新日期
        let nextClearCacheDateStr = Common.dateFormatNoTime(nextClearCacheDate)
        if (dateStr >= nextClearCacheDateStr) {
            DeviceStorageUtil.set("clearCacheDate", dateStr)
            result = true
        }
    }

    return result
}
/**
 * 定期清理过期文件
 */
function clearFileCacheForRegular() {
    let timestamp = new Date().getTime() - FILE_EXPIRATION_TIME
    let dateStr = Common.dateFormat(timestamp)
    let sql = `select * from THF_APP_FILE where OPENTIME < '${dateStr}' `
    SQLiteUtil.selectData(sql).then(result => {
        if (result.length > 0) {
            let data = result.raw()
            for (const it of data) {
                //删除文件
                let path = APPFILE_DIR + '/' + it.NAME
                RNFetchBlob.fs.exists(path).then(exists => {
                    if (exists) {
                        RNFetchBlob.fs.unlink(path).then(() => {
                            console.log('删除文件成功:', path);
                        }).catch(err => {
                            console.log('删除文件失败:', err);
                        })
                    } else {
                        console.log('删除文件不存在:', path);
                    }
                }).catch(err => {
                    console.log('判断文件存在异常:', err);
                })
                //删除文件资料
                let fileId = it.ID
                let dSql = `delete from THF_APP_FILE where ID = '${fileId}'`
                SQLiteUtil.deleteData(dSql).then(() => {
                    console.log('删除文件资料成功:', fileId);
                }).catch(err => {
                    console.log('删除文件资料失败:', err);
                })
            }
        } else {
            console.log('无过期文件需要清理');
        }
    }).catch(err => {
        console.log('查询定期清理文件失败:', err);
    })
}

//要清除缓存的表
const clearCacheTables = [
    "THF_APP",
    "THF_APPINFO",
    "THF_APPVISITLOG",
    "THF_LOG",
    "THF_LANGUAGE",
    "THF_MASTERDATA",
    "THF_MSG",
    "THF_MSG_USERREAD",
    "THF_NOTICE",
    "THF_CONTACT",
    "THF_BANNER",
    "THF_EVENT",
    "THF_DAILY_ORAL_ENGLISH",
    "THF_COMPANY_DOC",
    "THF_GROUPFILE",
];