import axios from 'axios';
import fs from 'fs';
import path from 'path';
const fullpath =  path.join(__dirname,  '/token.txt')
export function pullManifest(token:string) {
	let buildReq:any;
	let manifestReq:any;
	const headers: any = {};
	headers['X-EpicGames-Lanuage'] = 'en'
	headers['Authorization'] = 'bearer ' + token
      return axios({
            url: "https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/public/assets/Windows/4fe75bbc5a674f4f9b356b5c90567da5/Fortnite?label=Live",
            method: "GET",
            headers : headers,
            responseType: "json"
        }).then(function (response:any) {
			 response.data.buildVersion;
			 response.data.items.MANIFEST.path;
			//return [buildReq,manifestReq]

        }).catch((error:any)=>{
            console.log(error)
		})
		
		return [buildReq,manifestReq]
	}
	