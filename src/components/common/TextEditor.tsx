import ReactQuill, { Quill } from 'react-quill';
import { ImageResize } from 'quill-image-resize-module-ts';
import 'quill-divider';
import '../../styles/editor/editor.scss';

Quill.register('modules/imageResize', ImageResize);

const toolbarOptions = [
  //   [{ font: ['sans-serif', 'serif'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ align: [] }],
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'divider'],

  // [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  //   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme,
  ['image'],

  ['clean'] // remove formatting button
];

type TextEditorProps = {
  content?: string;
  updateContent: (content: string) => void;
  className?: string;
  style?: React.CSSProperties;
};

const TextEditor = ({
  content = '',
  updateContent,
  className = '',
  style = {}
}: TextEditorProps) => {
  return (
    <div className={className} style={style}>
      <ReactQuill
        theme='snow'
        value={content}
        onChange={(value) => {
          updateContent(value);
        }}
        modules={{
          toolbar: toolbarOptions,
          divider: true,
          imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'Toolbar']
          }
        }}
        style={{ height: '50vh' }}
        placeholder='Enter content here...'
      />
    </div>
  );
};

export default TextEditor;
