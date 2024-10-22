import { RiErrorWarningFill } from "react-icons/ri";
import formStyle from "../../css/form.module.css";

interface deletePromptProps {
  onRequestClose: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  name: string;
  entities: string;
  action?: string;
}

const Prompt: React.FC<deletePromptProps> = ({
  onRequestClose,
  onDelete,
  name,
  entities,
  action = "Delete",
}) => {
  return (
    <div className={formStyle.wrapper}>
      <div>
        <h2>
          {action} {entities}
        </h2>
        <hr />
      </div>
      <div className={formStyle.statement}>
        <RiErrorWarningFill
          size={70}
          color="var(--danger-color)"
          style={{ marginBottom: "0.5rem" }}
        />
        <p>
          Are you sure you want to {action.toLowerCase()} {name}?
        </p>
      </div>
      <div>
        <button
          onClick={() => onRequestClose(false)}
          className={formStyle.button}
        >
          Go Back
        </button>
        <button onClick={() => onDelete()} className={formStyle.delete}>
          {action}
        </button>
      </div>
    </div>
  );
};

export default Prompt;
