import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  //這個 messageService 屬性必須是公共屬性，因為你將會在template中繫結到它
  constructor(public messageService: MessageService) {}
}
