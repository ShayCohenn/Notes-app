"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Trashbox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const removeAll = useMutation(api.documents.removeAll);
  const restoreAll = useMutation(api.documents.restoreAll);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/document/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Note Restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Note Deleted!",
      error: "Failed to Delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRemoveAll = () => {
    const promise = removeAll();
    toast.promise(promise, {
      loading: "Deleting all notes...",
      success: "Deleted all notes!",
      error: "Failed to delete all notes!",
    });
  };

  const onRestoreAll = () => {
    const promise = restoreAll();
    toast.promise(promise, {
      loading: "Restoring all notes...",
      success: "Restored all notes!",
      error: "Failed to restore all notes!",
    });
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredDocuments?.map((document) => (
          <div
            role="button"
            key={document._id}
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/10 flex
             items-center text-primary justify-between">
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 
                dark:hover:bg-neutral-600">
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200
              dark:hover:bg-neutral-600">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
        {filteredDocuments?.length === 0 ? (
          <p className="text-center text-muted-foreground pb-2">
            No Documents Found.
          </p>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div
              onClick={onRestoreAll}
              role="button"
              className="flex justify-center items-center hover:bg-neutral-200 
              dark:hover:bg-neutral-800">
              <Undo className="h-4 w-4 text-muted-foreground" />
              <button className="text-muted-foreground px-2">
                Recover all
              </button>
            </div>
            <ConfirmModal onConfirm={onRemoveAll}>
              <div
                className="flex justify-center items-center hover:bg-neutral-200
              dark:hover:bg-neutral-800">
                <Trash className="h-4 w-4 text-muted-foreground" />
                <button className="text-muted-foreground px-2">
                  Delete all
                </button>
              </div>
            </ConfirmModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trashbox;
