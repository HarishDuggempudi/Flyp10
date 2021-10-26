let URL: string;
if(typeof window != "undefined")
    URL = window.location.protocol + "//" + window.location.host;
else
    URL = 'https://flyp10.com';

export const HOST_URL: string = URL;
export const API_URL: string = HOST_URL + "/api/";
export const JSON_URL: string = HOST_URL + '/data/';
 