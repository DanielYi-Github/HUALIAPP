export const MEETING_REFRESHING                = 'MEETING_REFRESHING';   				//更新中→此部分更新指畫面更新
export const MEETING_REFRESHING_FOR_BACKGROUND = 'MEETING_REFRESHING_FOR_BACKGROUND';   //資料從遠方來須更新
export const MEETING_LOADMODETYPE              = 'MEETING_LOADMODETYPE';   				//載入參會方式
export const MEETING_SET_ATTENDEES             = 'MEETING_SET_ATTENDEES'; 				//添加與會人員
export const MEETING_ACTIONRESULT              = 'MEETING_ACTIONRESULT';   				//新增會議回傳結果
export const MEETING_MODIFYRESULT              = 'MEETING_MODIFYRESULT';   				//修改會議回傳結果
export const MEETING_CANCELRESULT              = 'MEETING_CANCELRESULT';   				//刪除會議回傳結果
export const MEETING_RESET                     = 'MEETING_RESET';   					//重置Meeting 的Redux state
export const MEETINGLIST_RESET                 = 'MEETINGLIST_RESET';   				//重置MeetingList 的Redux state
export const GET_MEETINGS                      = 'GET_MEETINGS';   						//取得會議
export const GET_MEETINGSPERSON_DATETIME       = 'GET_MEETINGSPERSON_DATETIME';   		//獲取特定人的會議時程
export const GET_MEETINGS_FREE_DATETIME        = 'GET_MEETINGS_FREE_DATETIME';    		//獲取特定人員有空的會議時程
export const MEETING_RESETMEETINGMESSAGE       = 'MEETING_RESETMEETINGMESSAGE';   		//清除提示訊息
export const MEETING_SETREGULARMEETINGOPTIONS  = 'MEETING_SETREGULARMEETINGOPTIONS';   	//例行性會議設定多語系內容
export const MEETING_SET_COMPANIES             = 'MEETING_SET_COMPANIES';   			//設定添加參與人的公司
export const MEETING_SET_ATTENDEES_BY_POSITION = 'MEETING_SET_ATTENDEES_BY_POSITION';   //添加職位分類的與會人員選項
export const MEETING_SET_ORGANIZATION          = 'MEETING_SET_ORGANIZATION';   			//添加組織樹選項
export const MEETING_SET_DEFAULT_MEETION_INFO  = 'MEETING_SET_DEFAULT_MEETION_INFO'; 	//設置與會人員的初始值
export const MEETING_BLOCKING                  = 'MEETING_BLOCKING'; 					//設置畫面是否要鎖住，不能點擊
export const MEETING_SET_REPEATTYPE            = 'MEETING_SET_REPEATTYPE'; 				//設置例行性會議的參數