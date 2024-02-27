package com.system.project.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.system.project.model.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {

    @JsonProperty("choices")
    private List<Choice> choices;


    @AllArgsConstructor
    @NoArgsConstructor
    public static class Choice{
        @JsonProperty("index")
        private int index;
        @JsonProperty("message")
        private ChatMessage message;



        public ChatMessage getMessage() {
            return message;
        }

        public void setMessage(ChatMessage message) {
            this.message = message;
        }
    }


    public List<Choice> getChoice() {
        return choices;
    }

}
