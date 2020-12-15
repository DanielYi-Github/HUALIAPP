import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import Common from './Common';


let FileOpen = {
  openGroupFile(user,oid,waterInfo,appendExt){
      let token = Common.encrypt(user.token);
      let userid = Common.encrypt(user.loginID);
      let obj = {
        "oid": oid,
        "waterInfo": waterInfo
      }
      content = Common.encrypt(JSON.stringify(obj));
      let params = {
        "token":token,
        "userId":userid,
        "content": content
      };

      RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          appendExt : appendExt,
          fileCache : true,
        }).fetch( 
          'POST',
          // 'http://10.0.96.113:8080/FileDownExample/', 
          // 'https://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/PDF32000_2008.pdf', 
          // 'http://172.16.0.39:8080/MobileApp/data/openGroupFileData',
          'http://192.168.125.104:8086/MobileApp/data/openGroupFileData',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify(params),
        )
        .then((res) => {
            console.log(res);
            console.log('The file saved to ', res.path())
            const path = res.path();
            // const localFile = getLocalPath(path);
            FileViewer.open(path)
            .then(() => {
              alert("成功");
              // success
            })
            .catch(error => {
                console.log(error);
            });
        }).catch((error)=>{
          console.log(error);
        })
  }
}

export default FileOpen;