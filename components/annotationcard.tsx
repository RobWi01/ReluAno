import { ICard, IFile } from "../types";
import { AiOutlineEdit, AiOutlineSave, AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import Stlviewer, { addcolor, removecolor } from "./stlviewer";
import DeleteModal from "./deleteModal";

type AnnotationCardProps = {
    card: ICard;
    deleteCard: Function;
    file: IFile;
};

export default function AnnotationCard({
    card,
    deleteCard,
    file,
}: AnnotationCardProps) {
    const [editing, setEdit] = useState<any>(card.new);
    const [title, setTitle] = useState<any>(card.title);
    const [text, setText] = useState<any>(card.text);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleEdit = () => {
        if (editing && (title != card.title || text != card.text)) {
            card.title = title;
            card.text = text;

            fetch("/api/write_anno", {
                method: "POST",
                body: JSON.stringify({ card }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        file.time = new Date().toLocaleString();
        fetch("/api/update_file", {
            method: "POST",
            body: JSON.stringify({ file }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setEdit(editing ? false : true);
    };

    const onDelete = () => {
        deleteCard(card._id);

        fetch("/api/delete_anno", {
            method: "POST",
            body: JSON.stringify({ card }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        file.card_ids = file.card_ids.filter((ID) => ID != card._id);
        fetch("/api/update_file", {
            method: "POST",
            body: JSON.stringify({ file: file }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    const onAnnotation = () => {
        if (!editing) {
            removecolor(file)
            file.selected = card;
            addcolor(file)
            fetch("/api/update_file", {
                method: "POST",
                body: JSON.stringify({ file }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    };

    return (
        <div className="flex items-center" onClick={onAnnotation}>
            <form className="w-80 text-gray-700 px-3" onSubmit={toggleEdit}>
                <div className="text-2xl mb-2">
                    {editing ? (
                        <input
                            className="border-2"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && toggleEdit()}
                        />
                    ) : (
                        title
                    )}
                </div>
                <div>
                    {editing ? (
                        <textarea
                            className="w-full border-2"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && toggleEdit()}
                        />
                    ) : (
                        text
                    )}
                </div>
            </form>
            <div className="text-gray-700 text-2xl">
                <button className="m-2" onClick={toggleEdit}>
                    {editing ? <AiOutlineSave /> : <AiOutlineEdit />}
                </button>
                {isOpen ? (
                    <DeleteModal
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        onDelete={onDelete}
                    >
                        Wil je de annotatie verwijderen?
                    </DeleteModal>
                ) : (
                    <button onClick={() => setIsOpen(true)}>
                        <AiOutlineDelete className="w-7 h-7" />
                    </button>
                )}
            </div>
        </div>
    );
}
