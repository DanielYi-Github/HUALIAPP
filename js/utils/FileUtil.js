import RNFetchBlob from 'rn-fetch-blob';
import Common from './Common';
import * as SQLite from './SQLiteUtil';
import { TOMCAT_HOST } from './Contant';
import * as LoggerUtil from './LoggerUtil';
import NetUtil from './NetUtil';


const CACHE_DIR = RNFetchBlob.fs.dirs.CacheDir //缓存目录
const APPFILE_DIR = CACHE_DIR + '/appfile' //APP文件缓存目录
// const DOCUMENT_DIR = RNFetchBlob.fs.dirs.DocumentDir //文件目录
const REGULAR_TIME = 7 * 24 * 60 * 60 * 1000 //定期7天清理
// const RE_DOWNLOAD_COUNT = 5 //下载异常可重新下载次数

/**
 * 下载文件并返回文件路径
 * @param {string} url API
 * @param {object} params 参数
 */
async function download(url, params) {
  let id = getFileRandomID()
  let respone = null
  const RNFetchBlobTemp = RNFetchBlob.config({
    fileCache: true,
    // timeout: 2000
    path: APPFILE_DIR + '/' + id
  })

  
  await NetUtil.getDownloadFile(params, url, RNFetchBlobTemp).then((res) => {

    if(res == null) return respone;
    
    respone = res
    let status = res.respInfo.status
    switch (status) {
      case 200:
        //没有处理
        break
      case 204:
        res.flush()//清除文件
        LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", "文件不存在");
        break
      default:
        res.flush()//清除文件
        LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", status);
        break
    }
  })
  return respone;


  /*
    await RNFetchBlobTemp.fetch(
      'POST',
      `${TOMCAT_HOST}${url}`,
      {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      JSON.stringify(params)
    ).progress((received, total) => {
      console.log('progress', received / total)
    }).then(res => {
      // console.log('res:', res);
      respone = res
      let status = res.respInfo.status
      switch (status) {
        case 200:
          //没有处理
          break
        case 204:
          res.flush()//清除文件
          LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", "文件不存在");
          break
        default:
          res.flush()//清除文件
          LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", status);
          break
      }
    }).catch(err => {
      console.log('download err:', err);
      LoggerUtil.addErrorLog(url, "APP utils in FileUtil", "ERROR", "" + err);
    })

    return respone
  */
}

/**
 * 下载文件，将文件信息存放到DB，并返回文件路径
 * @param {string} url API
 * @param {object} content API参数
 * @param {object} user 用户信息
 * @param {string} fileId 文件ID
 * @param {string} modified 修改时间
 */
async function downloadFile(url, content, user, fileId, modified) {
  content = (typeof content == "string") ? content : JSON.stringify(content);
  //API参数
  let params = {
    token: Common.encrypt(user.token),
    userId: Common.encrypt(user.loginID),
    content: Common.encrypt(content)
  }
  let path = ""
  let respone = await download(url, params)
  if (respone != null) {
    path = respone.data
    addFile(fileId, path, modified)
  }

  return path
}
/**
 * 将旧文件删除重新下载文件，将文件信息存放到DB，并返回文件路径
 * @param {string} url API
 * @param {object} content API参数
 * @param {object} user 用户信息
 * @param {string} fileId 文件ID
 * @param {string} modified 修改时间
 * @param {string} oldPath 旧路径
 */
export async function reDownloadFile(url, content, user, fileId, modified, oldPath) {
  //判断是否有旧文件路径
  if (oldPath == null || oldPath == undefined) {
    let sql = `select * from THF_APP_FILE where ID = '${fileId}' `
    let result = await SQLite.selectData(sql)
    if (result.length > 0) {
      oldPath = APPFILE_DIR + '/' + result.item(0).NAME
    }
  }
  //删除文件
  if (oldPath != null && oldPath != undefined) {
    let exist = await RNFetchBlob.fs.exists(oldPath)//文件是否存在
    if (exist) {
      let isDir = await RNFetchBlob.fs.isDir(oldPath)//路径是否是文件夹
      if (!isDir) {
        await RNFetchBlob.fs.unlink(oldPath).catch(err => {
          LoggerUtil.addErrorLog("reDownloadFile", "APP utils in FileUtil", "ERROR", err);
        })
      }
    }
  }
  //删除文件资料
  let dSql = `delete from THF_APP_FILE where ID = '${fileId}' `
  await SQLite.deleteData(dSql).catch(err => {
    LoggerUtil.addErrorLog("reDownloadFile", "APP utils in FileUtil", "ERROR", err);
  })
  //下载文件
  let path = await downloadFile(url, content, user, fileId, modified)

  return path
}

/**
 * 获取手机文件路径
 * @param {string} url API
 * @param {object} content API参数
 * @param {object} user 用户信息
 * @param {string} fileId 文件ID
 * @param {string} modified 修改时间
 */
export async function getAppFilePath(url, content, user, fileId, modified) {
  let path = "" //文件路劲
  let sql = `select * from THF_APP_FILE where ID = '${fileId}' `
  let result = await SQLite.selectData(sql)

  console.log("result", result);
  if (result.length > 0) {
    path = APPFILE_DIR + '/' + result.item(0).NAME
    let oldPath = path //旧路径
    let exists = await RNFetchBlob.fs.exists(path)
    //判断文件是否存在
    
    console.log("exists", exists);
    if (exists) {
      //更新打开时间
      let dateStr = Common.dateFormat(new Date())
      let uSql = `update THF_APP_FILE set OPENTIME = '${dateStr}' where ID = '${fileId}' `
      SQLite.updateData(uSql)
      //对比修改时间
      if (modified != null && modified != undefined) {
        let lastModified = result.item(0).MODIFIEDTIME
        if (modified > lastModified) {
          path = await reDownloadFile(url, content, user, fileId, modified, oldPath)
        }
      }
    } else {
      //不存在重新下载
      path = await reDownloadFile(url, content, user, fileId, modified, oldPath)
    }
  } else {
    //不存在则下载
    path = await downloadFile(url, content, user, fileId, modified)
  }
  // console.log('获取文件:',path);
  return path
}
/**
 * 
 * @param {string} fileId 文件ID
 * @param {string} path 文件路径
 * @param {string} modified 修改时间
 * @returns 
 */
function addFile(fileId, path, modified) {
  return new Promise((resolve, reject) => {
    if (path != "") {
      //下载时间
      let dateStr = Common.dateFormat(new Date())
      //文件名称
      let pathArr = path.split('/')
      let name = pathArr[pathArr.length - 1]
      //最后修改时间
      if (modified == null || modified == undefined) {
        modified = ""
      }
      let sql = `insert into THF_APP_FILE values('${fileId}','${name}','${dateStr}','${modified}') `
      SQLite.insertData(sql).then(() => {
        // console.log('新增文件成功:', sql);
        resolve()
      }).catch(err => {
        LoggerUtil.addErrorLog("addFile", "APP utils in FileUtil", "ERROR", err);
        reject(err)
      })
    } else {
      let msg = "path is no value"
      LoggerUtil.addErrorLog("addFile", "APP utils in FileUtil", "ERROR", msg);
      reject(msg)
    }
  })

}
/**
 * 定期清理过期文件
 */
export function clearFileForRegular() {
  let timestamp = new Date().getTime() - REGULAR_TIME
  let dateStr = Common.dateFormat(timestamp)
  let sql = `select * from THF_APP_FILE where OPENTIME < '${dateStr}' `
  SQLite.selectData(sql).then(result => {
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
        SQLite.deleteData(dSql).then(() => {
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

/**
 * 获取文件随机ID
 * @returns 
 */
function getFileRandomID() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * 获取文件base64
 * @param {string} path 文件路径
 * @returns 
 */
export function getFileBase64(path) {
  return RNFetchBlob.fs.readFile(path, 'base64').then(data => {
    return data
  }).catch(err => {
    LoggerUtil.addErrorLog("getFileBase64", "APP utils in FileUtil", "ERROR", err);
    return ""
  })
}