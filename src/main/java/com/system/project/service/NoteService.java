package com.system.project.service;

import com.system.project.exceptions.InvalidTokenException;
import com.system.project.exceptions.NoteNotFoundException;
import com.system.project.model.Note;
import com.system.project.model.User;
import com.system.project.repository.NoteRepository;
import com.system.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class NoteService {


    private final NoteRepository noteRepository;
    private final JwtService jwtService;

    private final UserRepository userRepository;




    @Autowired
    public NoteService(NoteRepository noteRepository, JwtService jwtService, UserRepository userRepository){
        this.noteRepository = noteRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }


    //checks if the user email from the token matches the email from the database
    private User validateUserAndToken(String token){
        String userName = jwtService.extractUsername(token);
        User user = userRepository.findUserByEmail(userName).orElseThrow(()->
                new UsernameNotFoundException("User does not exist"));
        if(!jwtService.isTokenValid(token, user)){
            throw new InvalidTokenException("Invalid token");
        }
        return user;
    }


    //post a new note in a database, that is associated with the user email from the token
    //emails are unique to users
    public Note postNote(String token, Note note){
        User user = validateUserAndToken(token);
        note.setUser(user);
        note.setContent(note.getContent());
        note.setDate(LocalDate.now());
        return noteRepository.save(note);
    }


    //gets the notes for this page, uses Pageable to (page number and size) retrieve the needed notes
    public Map<String, Object> getNotes(String token, Pageable page){
        User user = validateUserAndToken(token);
        Page<Note> fetchedPage = noteRepository.findByUserId(user.getId(), page);
        List<Note> notes = fetchedPage.getContent(); //get the notes from the page
        List<Map<String, Object>> noteList = new ArrayList<>();
        for (Note note : notes) {
            Map<String, Object> noteMap = new HashMap<>();
            noteMap.put("content", note.getContent());
            noteMap.put("date", note.getDate());
            noteMap.put("id", note.getId());
            noteList.add(noteMap);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("notes", noteList);
        response.put("currentPage", fetchedPage.getNumber());//number of current page
        response.put("totalItems", fetchedPage.getTotalElements());//total notes on that page
        //total number of pages, so the client knows how many pages to display
        response.put("totalPages", fetchedPage.getTotalPages());
        return response;
    }


    //updates an existing note
    @Transactional
    public void updateNote(String token, Integer noteId, String content){
        validateUserAndToken(token);
        if(!noteRepository.existsById(noteId)) {
            throw new NoteNotFoundException("Note does not exist");
        }
        noteRepository.updateNoteContentById(noteId, content);

    }

    //deletes an existing note
    @Transactional
    public void deleteNoteById(String token, Integer noteId){
        validateUserAndToken(token);
        if(!noteRepository.existsById(noteId)) {
            throw new NoteNotFoundException("Note not found");
        }
        noteRepository.deleteById(noteId);
    }



}
