import React, { Component } from 'react';

export default class User extends Component {

    constructor(props) {
        super(props);
        this.state     = {};
        this.id        = '';
        this.loginID   = '';
        this.password  = '';
        this.token     = '';
        this.name      = '';
        this.sex       = 'M'; //男生M,女生F
        this.email     = '';
        this.depID     = '';
        this.depName   = '';
        this.co        = '';
        this.plantID   = '';
        this.plantName = '';
        this.regID     = '';
        this.isPush    = '';
        this.picture   = null;
        this.pictureUrl= null;
        this.cellphone = '';
        this.telphone  = '';
        this.skype     = '';
        this.birthday  = null;
    }


    render() {
        return null;
    }
    getID = () => {
        return this.id;
    }
    setID = (id) => {
        this.id = id;
    }
    getName = () => {
        return this.id;
    }
    setName = (name) => {
        this.name = name;
    }
    getLoginID = () => {
        return this.loginID;
    }
    setLoginID = (loginID) => {
        this.loginID = loginID;
    }
    getPassword = () => {
        return this.password;
    }
    setPassword = (password) => {
        this.password = password;
    }
    getToken = () => {
        return this.token;
    }
    setToken = (token) => {
        this.token = token;
    }
    getSex() {
        return this.sex;
    }
    setSex = (sex) => {
        this.sex = sex;
    }
    getEmail() {
        return this.email;
    }
    setEmail = (email) => {
        this.email = email;
    }
    getDepID() {
        return this.depID;
    }
    setDepID = (depID) => {
        this.depID = depID;
    }
    getDepName() {
        return this.depName;
    }
    setDepName = (depName) => {
        this.depName = depName;
    }
    getCO() {
        return this.co;
    }
    setCO = (co) => {
        this.co = co;
    }
    getPlantID() {
        return this.plantID;
    }
    setPlantID = (plantID) => {
        this.plantID = plantID;
    }
    getPlantName() {
        return this.plantName;
    }
    setPlantName = (plantName) => {
        this.plantName = plantName;
    }

    getRegID(){
        return this.regID;
    }
    setRegID(regID){
        this.regID = regID;
    }
    getPush(){
        return this.isPush;
    }
    setPush(isPush){
        this.isPush = isPush;
    }
    getPicture(){
        return this.picture;
    }
    setPicture(picture){
        this.picture = picture;
    }
    getPictureUrl(){
        return this.pictureUrl;
    }
    setPictureUrl(pictureUrl){
        this.pictureUrl = pictureUrl;
    }
}