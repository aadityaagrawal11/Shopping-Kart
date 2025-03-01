import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ChatbotService } from '../Services/chatbot.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  userInput: string = '';
  currentTime = new Date();
  chatHistory: any[] = [];
  showChatWindow: boolean = false; // Initially hide the chat window
  Chatid!: string;

  @ViewChild('chatWindow') private chatWindow!: ElementRef; // Reference to the chat window

  constructor(private chatbotService: ChatbotService,private router: Router,
    private http: HttpClient, private confirmationService: ConfirmationService, private messageService: MessageService
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.currentTime = new Date();
  }
  // { sender: string, message: string, time: Date }
  ngOnInit() {
    //Add custom first bot message to chat history
    this.getMessage();
    //this.chatHistory.push({ sender: 'bot', message: 'How can I help you!!' , time: this.currentTime });
  }
  getMessage() {
    this.http.get<any[]>(`http://localhost:3000/chatBot`).subscribe({
      next: (res) => {
        this.chatHistory = res[0].chat;
        this.Chatid = res[0].id;
        console.log('get', this.chatHistory);
      }
    })
  }

  sendMessage() {
    if (!this.userInput.trim()) {
      return; // Ignore empty messages
    }

    //Check for the category Product
 if(this.userInput === 'Electronics' || this.userInput === 'Jewelery' ||
 this.userInput === `Men's clothing` || this.userInput === `Women's clothing`){
  this.chooseCategory(this.userInput);
 }
 else{

  // Add user message to chat history
  this.chatHistory.push({ sender: 'user', message: this.userInput, time: this.currentTime,clickable:false});
 
    // Get response from the chatbot service
    this.chatbotService.getResponse(this.userInput)
      .subscribe(response => {
        // Add chatbot response to chat history
        this.chatHistory.push({ sender: 'bot', message: response, time: this.currentTime ,clickable:false});


        this.http.patch<any[]>(`http://localhost:3000/chatBot/${this.Chatid}`, { chat: this.chatHistory }).subscribe({
          next: (res) => {
            console.log(res, 'posted');
          }
        })

        // Clear user input
        this.userInput = '';
      })
    }
  }

  // Category

  categories: string[] = ["Electronics", "Jewelery", "Men's clothing", "Women's clothing"];
  selectedCategory: string | undefined;
  categoryProduct: any = [];

  chooseCategory(category: string): void {
    this.selectedCategory = category;
    // console.log(this.selectedCategory);
    this.chatHistory.push({ sender: 'user', message: this.selectedCategory, time: this.currentTime,clickable:false });
  


    this.http.get<any>(`http://localhost:3000/productApi/?category=${category.toLowerCase()}`).subscribe({
      next: (response) => {
        this.categoryProduct = response;

      //  let botMessage = '';
  

        // this.categoryProduct.forEach((element: { title: any, id: any }) => {
        //   this.chatHistory.push({ sender: 'bot', message: `<a (click)="navigateToProduct('${element.id}')">${element.title}</a>`, time: this.currentTime });


        // Concatenate all titles into a single string
      //   this.categoryProduct.forEach((element: any, index: number) => {
      //     // Concatenate the title and ID separated by a unique delimiter (e.g., ';')

      //   // botMessage += `<a href="/dashboard/product/${element.id}">${element.title}</a>`;
      //  botMessage += `<a [routerLink]="/dashboard/product/${element.id} ">${element.title}</a>`;
      //     //  (click)='navigateToProduct(${element.id})'
      //    // Add a line break if it's not the last title
      //     if (index !== this.categoryProduct.length - 1) {
      //       botMessage += '<br>';
      //     }
      //   });
      //   this.chatHistory.push({ sender: 'bot', message: botMessage, time: this.currentTime, clickable:true});
         
      this.categoryProduct.forEach((element: any) => {
          this.chatHistory.push({ sender: 'bot', message: element, time: this.currentTime, clickable:true });
         });
          console.log(this.categoryProduct);

        this.http.patch<any[]>(`http://localhost:3000/chatBot/${this.Chatid}`, { chat: this.chatHistory }).subscribe({
      next: (res) => {
        console.log(res, 'posted');
      }
    })
      },
      error: console.log,

    })
    
  }
// Method to navigate to product page
navigateToProduct(productId:any): void {
  console.log('Method called', productId)
  this.router.navigate(['/dashboard/product/', productId]); //  product page route is '/product/:id'
}

  toggleChatWindow() {

    this.showChatWindow = !this.showChatWindow; // Toggle the chat window visibility

  }

  scrollToBottom() {
    try {
      if (this.chatWindow) {
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.log(err);

    }
  }

  confirm(event: Event) {
    console.log(event);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm m-2',
      acceptButtonStyleClass: 'p-button-sm m-2',
      accept: () => {
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.http.patch<any[]>(`http://localhost:3000/chatBot/${this.Chatid}`, {
          chat: [{ sender: 'bot', message: 'How can I help you!!', time: this.currentTime ,clickable:false}]
        })
          .subscribe(() => {
            this.toggleChatWindow();
            this.getMessage();
          });


      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

}