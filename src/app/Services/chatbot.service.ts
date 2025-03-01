import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

 
  getResponse(message: string): Observable<string> {
    // Simulate a simple chatbot response based on user input
    const responses: { [key: string]: string } = {
      'hello': 'Hi there!',
      'how are you': 'I am fine, thank you!',
      'bye': 'Goodbye!',
      'what is your name' : 'My name is EVA, your personal assistant!',
    };

    // Check if the message has a predefined response, otherwise respond with a default message
    const response = responses[message.toLowerCase()] || "I'm sorry, I didn't understand that.";

    return of(response);
  }
}
