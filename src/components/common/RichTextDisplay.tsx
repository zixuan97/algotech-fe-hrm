import ReactQuill from 'react-quill';
import 'quill-divider';
import '../../styles/editor/editor.scss';

type RichTextDisplayProps = {
  content?: string;
  updateContent: (content: string) => void;
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const RichTextDisplay = ({
  content = '',
  updateContent,
  onBlur,
  className = '',
  style = {}
}: RichTextDisplayProps) => {
  return (
    <div className={className} style={style}>
      <ReactQuill
        readOnly
        theme='bubble'
        value={content}
        onChange={(value) => {
          updateContent(value);
        }}
        onBlur={onBlur}
        modules={{ toolbar: false }}
        style={{ minHeight: '30vh' }}
      />
    </div>
  );
};

export default RichTextDisplay;
