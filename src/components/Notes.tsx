import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowLeft } from "lucide-react";
import { addNote, getNotesByUserAndFriend, deleteNote } from "@/api/note"; // นำเข้าฟังก์ชัน deleteNote

interface Note {
    id: number; // เพิ่ม ID ของโน้ต
    title: string;
    content: string;
    timestamp: string;
    friendId: string | null;
    userId: string | null;
}

const Notes = ({ friendId, userId, onBackClick }: { friendId: string | null; userId: string; onBackClick: () => void }) => {
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notes = await getNotesByUserAndFriend(userId);
                setNotesList(notes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        fetchNotes();
    }, [userId]);

    const handleAddNote = async () => {
        if (!title.trim() || !content.trim()) return;

        const newNote: Note = {
            id: 0, // ID จะถูกกำหนดหลังจากที่โน้ตถูกบันทึก
            title,
            content,
            timestamp: new Date().toLocaleString(),
            friendId,
            userId,
        };

        try {
            const savedNote = await addNote(newNote);
            setNotesList((prevNotes) => [...prevNotes, savedNote]);
            setTitle("");
            setContent("");
            setError(null);
        } catch (error) {
            console.error("Error adding note:", error);
            setError("Failed to add note. Please try again.");
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        try {
            await deleteNote(noteId); // เรียกใช้งานฟังก์ชันลบโน้ต
            setNotesList((prevNotes) => prevNotes.filter(note => note.id !== noteId)); // อัปเดตสถานะโน้ต
        } catch (error) {
            console.error("Error deleting note:", error);
            setError("Failed to delete note. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="p-6 border border-gray-300 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">Notes</h2>
                    <Button onClick={onBackClick} className="text-blue-600 hover:underline" variant="ghost">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="flex flex-col space-y-4 mt-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Note Content"
                        className="border border-gray-300 rounded-md p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 h-24 resize-none"
                        style={{ lineHeight: '1.5' }}
                    />
                    <Button onClick={handleAddNote} className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200 px-4 py-2 rounded-md self-center">
                        Add Note
                    </Button>
                </div>
            </div>

            <div className="space-y-6 mt-6">
                {notesList.map((note) => (
                    <div key={note.id} className="p-4 border border-gray-300 rounded-lg bg-white transition duration-200">
                        <div className="flex justify-end mb-2">
                            <Button onClick={() => handleDeleteNote(note.id)} variant="outline" className="text-red-500">
                                <X className="w-2 h-2" />
                            </Button>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{note.title}</h3>
                        <span className="text-xs text-gray-500">{note.timestamp}</span>
                        <p className="text-gray-700 mb-2">{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
