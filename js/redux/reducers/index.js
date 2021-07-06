'use strict';

import { combineReducers } from 'redux';

import AppInit    from './AppInitReducer'
import Login      from './LoginReducer';
import Language   from './LanguageReducer';
import Network    from './NetworkReducer';
import Submit     from './SubmitReducer';
import Message    from './MessageReducer';
import UserInfo   from './UserInfoReducer';
import Home       from './HomeReducer';
import Publish    from './PublishReducer';
import MyForm     from './MyFormReducer';
import Form       from './FormReducer';
import Common     from './CommonReducer';
import CreateForm from './CreateFormReducer';
import Document   from './DocumentReducer';
import Birthday   from './BirthdayReducer';
import Report     from './ReportReducer';
import Theme      from './ThemeReducer';
import Biometric  from './BiometricReducer';
import Deputy     from './DeputyReducer';
import Salary     from './SalaryReducer';
import Survey     from './SurveyReducer';
import Meeting    from './MeetingReducer';
import DailyOralEnglish from "./DailyOralEnglishReducer";

const rootReducer = combineReducers({
	AppInit,
	Login,
	Language,
	Network,
	Submit,
	Message,
	UserInfo,
	Home,
	Publish,
	MyForm,
	Form,
	Common,
	CreateForm,
	Document,
	Birthday,
	Report,
	Theme,
	Biometric,
	Deputy,
	Salary,
	Survey,
	Meeting,
	DailyOralEnglish
});

export default rootReducer;