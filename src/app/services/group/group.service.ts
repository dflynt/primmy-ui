import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  restService: RestService;
  userPortNumber: string = "8888";

  constructor(restService: RestService) {
    this.restService = restService;
  }

  createGroup(groupName: string, userId: string, authToken: string): Observable<any> {
    return this.restService.post("/createGroup/user/" + userId, this.userPortNumber, groupName, authToken);
  }
}
