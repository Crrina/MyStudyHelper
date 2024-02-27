package com.system.project.repository;

import com.system.project.model.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface NoteRepository extends JpaRepository<Note,Integer> {



    Page<Note> findByUserId(Integer id, Pageable pageable);


    @Modifying
    @Query("UPDATE Note n SET n.content = :content WHERE n.id = :id")
    Integer updateNoteContentById(@Param("id") Integer id, @Param("content") String content);



}
