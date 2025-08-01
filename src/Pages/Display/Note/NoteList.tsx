import { NoteListProps } from "@/Interface/Types";
import { DisplayNotes } from "./DisplayNotes";
import React from "react";

export const NoteList = ({ localNotes }: NoteListProps) => {
  return (
    <div className="note-whole-list flex flex-col items-center p-4 justify-start w-full h-full flex-[0_0_50%]">
      <div className="flex w-full text-2xl">
        <h3 className=" font-bold align-start justify-start mb-4">Notes</h3>
      </div>

      <div className="all-notes w-full [column-width:120px] [column-gap:25px] sm:[column-gap:50px] sm:[column-width:250px]">
        {localNotes.length > 0 ? (
          localNotes.map((note) => (
            <React.Fragment key={note.id}>
              <DisplayNotes
                key={note.id}
                note={note}
                content={note.Content}
                image={note.Image}
              />
            </React.Fragment>
          ))
        ) : (
          <li>No notes found</li>
        )}
      </div>
    </div>
  );
};
