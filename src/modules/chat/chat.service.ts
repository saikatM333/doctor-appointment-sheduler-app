import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../database/entities/message.entity';
import { ChatRoom } from '../database/entities/chat-room.entity';
import { Client } from '../database/entities/clients.entity';
import { Doctor } from '../database/entities/doctors.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
    ){}

    async createChatRoom(client: Client, doctor: Doctor): Promise<String> {
        return "create chat room";
    }
    async sendMessage(client: Client, doctor: Doctor, content: string, sender: 'client' | 'doctor'): Promise<String>{
            return "send message"
    }
    async getMessages(chatRoomId: number): Promise<String> {
        return "get messages "
    }

}
