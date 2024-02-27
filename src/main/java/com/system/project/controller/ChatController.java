package com.system.project.controller;

import com.system.project.api.ChatRequest;
import com.system.project.api.ChatResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bot")
public class ChatController {

    //the values are specified in application.properties
    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURl;

    @Value("${openai.api.key}")
    private String key;

    @Autowired
    private RestTemplate template;


    //Makes use of OpenAiConfig, sends a request to the openAI model that is specified in application.properties
    @GetMapping("/chat")
    public String chat(@RequestParam("prompt") String prompt) {
        ChatRequest request = new ChatRequest(model, prompt);
        ChatResponse response = template.postForObject(apiURl, request, ChatResponse.class);
        return response.getChoice().get(0).getMessage().getContent();

    }


}
