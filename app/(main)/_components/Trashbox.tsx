"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
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
  const { edgestore } = useEdgeStore();
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring...",
      success: "Document Restored!",
      error: "Failed to restore document.",
    });
  };

  const onRemove = async (documentId: Id<"documents">) => {
    const coverImageUrl = documents?.filter((doc) => {
      return doc._id === documentId;
    });

    if (
      coverImageUrl &&
      coverImageUrl.length > 0 &&
      coverImageUrl[0].coverImage
    ) {
      await edgestore.publicFiles.delete({
        url: coverImageUrl[0].coverImage,
      });
    }
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Document Deleted!",
      error: "Failed to Delete document.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRemoveAll = () => {
    const coverImageUrl = documents?.map((doc) => {
      return doc?.coverImage;
    });

    if (coverImageUrl && coverImageUrl.length > 0) {
      coverImageUrl.forEach(async (url) => {
        if (url) {
          await edgestore.publicFiles.delete({
            url: url,
          });
        }
      });
    }
    const promise = removeAll();
    toast.promise(promise, {
      loading: "Deleting all documents...",
      success: "Deleted all documents!",
      error: "Failed to delete all documents!",
    });

    router.push("/documents");
  };

  const onRestoreAll = () => {
    const promise = restoreAll();
    toast.promise(promise, {
      loading: "Restoring all documents...",
      success: "Restored all documents!",
      error: "Failed to restore all documents!",
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
