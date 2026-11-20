
import type { Note } from '../types/note'

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="note-card">
      <h2>{note.title}</h2>

      <p>{note.content}</p>

      <span>Kategori: {note.category}</span>

      <br />

      <button
        type="button"
        onClick={() => onDelete(note.id)}
      >
        Hapus
      </button>
    </div>
  )
}

export default NoteCard
