package com.system.project.controller;

import com.system.project.model.Note;
import com.system.project.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "note")
public class NoteController {



    private final NoteService noteService;



    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }


    //To post a new note, checks the token and if the post wa successful returns 200
    @PostMapping
    public ResponseEntity<?> postNote(@RequestHeader("Authorization") String token , @RequestBody Note note){
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        noteService.postNote(actualToken, note);
        return ResponseEntity.ok("Note got saved");
    }

    //Gets a note from the database based on the page and size requested by the client
    @GetMapping
    public ResponseEntity<Map<String, Object>> getNote(@RequestHeader("Authorization") String token,
                                                       @RequestParam("page") int page,
                                                       @RequestParam("size") int size){
        //sorting the pages by date, so the recent dates are fst fetched
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        Pageable pageable = PageRequest.of(page, size, Sort.by("date"));
        Map<String, Object> notes = noteService.getNotes(actualToken, pageable);
        return ResponseEntity.ok(notes);
    }

    //deletes a note
    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@RequestHeader("Authorization") String token, @PathVariable Integer noteId){
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        noteService.deleteNoteById(actualToken, noteId);
        return ResponseEntity.ok().build();
    }

    //updates a note
    @PutMapping("/api/{noteId}")
    public ResponseEntity<?> updateNote(@RequestHeader("Authorization") String token,
                                        @PathVariable Integer noteId, @RequestBody String content){
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        noteService.updateNote(actualToken, noteId, content);
        return ResponseEntity.ok().build();
    }



}

