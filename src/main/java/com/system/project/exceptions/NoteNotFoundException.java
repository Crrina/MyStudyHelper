package com.system.project.exceptions;

public class NoteNotFoundException extends RuntimeException{

    public NoteNotFoundException(String name){
        super(name);
    }
}
