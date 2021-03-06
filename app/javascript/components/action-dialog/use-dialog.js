import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectDialog } from "./selectors";
import { clearDialog, setDialog, setPending } from "./action-creators";

export const useDialog = dialogs => {
  const dispatch = useDispatch();
  const dialog = useSelector(state => selectDialog(state));
  const name = dialog.get("dialog");
  const isOpen = dialog.get("open", false);
  const isPending = dialog.get("pending", false);

  const handleDialog = useCallback(
    params => {
      dispatch(setDialog(params));
    },
    [dispatch]
  );

  const setDialogPending = useCallback(
    pending => {
      dispatch(setPending(pending));
    },
    [dispatch]
  );

  const dialogClose = useCallback(() => {
    dispatch(clearDialog());
  }, [dispatch]);

  const dialogOpen = Array.isArray(dialogs)
    ? dialogs.reduce((prev, current) => {
        const obj = prev;

        obj[current] = current === name && isOpen;

        return obj;
      }, {})
    : dialogs === name && isOpen;

  return {
    dialogOpen,
    dialogClose,
    setDialogPending,
    pending: isPending,
    setDialog: handleDialog,
    currentDialog: name
  };
};

export default useDialog;
