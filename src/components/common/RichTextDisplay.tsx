import ReactQuill from 'react-quill';
import 'quill-divider';
import '../../styles/editor/editor.scss';

type RichTextDisplayProps = {
  content?: string;
  className?: string;
  style?: React.CSSProperties;
};

const RichTextDisplay = ({
  content = '',
  className = '',
  style = {}
}: RichTextDisplayProps) => {
  return (
    <div className={className} style={style}>
      <ReactQuill
        readOnly
        theme='bubble'
        value={content}
        modules={{ toolbar: false }}
        style={{ minHeight: '30vh' }}
      />
    </div>
  );
};

export default RichTextDisplay;
