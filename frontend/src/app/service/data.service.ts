import { Injectable } from '@angular/core';

//import de enviromente, onde se encontra o caminho para o backend larvel
import { environment } from 'src/environments/environment'; 
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }


  registerUser(data){
    return this.httpClient.post(environment.apiUrl+'/api/register/', data)
  }
}
