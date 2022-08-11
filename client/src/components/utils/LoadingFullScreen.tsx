import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ReactLoading from "react-loading";

const LoadingFullScreen = ({ loading }: { loading: boolean }) => {
  return (
    <Dialog
      open={loading}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="opacity-[0.5] bg-black"
      fullScreen
    >
      <DialogContent className="flex items-center justify-center bg-black">
        <ReactLoading
          type="spinningBubbles"
          color="white"
          width={200}
          height={200}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LoadingFullScreen;
