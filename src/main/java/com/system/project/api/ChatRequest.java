package com.system.project.api;


import com.system.project.model.ChatMessage;


import java.util.ArrayList;
import java.util.List;


public class ChatRequest {

    private String model;
    private List<ChatMessage> messages;

    public ChatRequest(String model, String prompt){
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new ChatMessage("user", prompt));
    }




    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
