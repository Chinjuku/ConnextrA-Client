// Notes.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowLeft } from "lucide-react"; // Import necessary icons

interface Note {
    title: string;
    content: string;
    image?: string; // Optional image field
    timestamp: string; // Added timestamp field
}

const Notes = ({ onBackClick }: { onBackClick: () => void }) => {
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<string>(""); // State for the image

    const handleAddNote = () => {
        if (!title.trim() || !content.trim()) return; // Don't add empty notes

        const newNote: Note = {
            title,
            content,
            image, // Add the image to the note
            timestamp: new Date().toLocaleString(), // Get the current date and time
        };

        setNotesList([...notesList, newNote]); // Add the note to the list
        setTitle(""); // Clear the title input
        setContent(""); // Clear the content input
        setImage(""); // Clear the image input
    };

    const handleDeleteNote = (index: number) => {
        const updatedNotes = notesList.filter((_, i) => i !== index);
        setNotesList(updatedNotes);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // Set the image data URL
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="p-6 border border-gray-300 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">Notes</h2>
                    <Button
                        onClick={onBackClick} // Trigger the back navigation
                        className="text-blue-600 hover:underline"
                        variant="ghost" // Use ghost variant for a minimal look
                    >
                        <ArrowLeft className="w-5 h-5" /> {/* Back icon */}
                    </Button>
                </div>
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
                        style={{ lineHeight: '1.5' }} // Set consistent line height
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <Button
                        onClick={handleAddNote}
                        className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200 px-4 py-2 rounded-md self-center"
                    >
                        Add Note
                    </Button>
                </div>
            </div>

            <div className="space-y-6 mt-6">
                {notesList.map((note, index) => (
                    <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white transition duration-200">
                        <div className="flex justify-end mb-2"> {/* Flex to position the delete button */}
                            <Button onClick={() => handleDeleteNote(index)} variant="outline" className="text-red-500">
                                <X className="w-2 h-2" /> {/* Smaller Cross icon size */}
                            </Button>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{note.title}</h3>
                        <span className="text-xs text-gray-500">{note.timestamp}</span> {/* Display the timestamp */}
                        <p className="text-gray-700 mb-2">{note.content}</p>
                        {note.image && (
                            <div className="flex justify-center"> {/* Centering the image */}
                                <img src={note.image} alt="Note" className="mt-2 border border-gray-300 rounded-md max-h-48 object-cover" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
