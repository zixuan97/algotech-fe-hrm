import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  [{ font: ['sans-serif', 'serif'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ align: [] }],
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme,
  ['image'],

  ['clean'] // remove formatting button
];

const Editor = () => {
  const [content, setContent] = React.useState<string>('');
  return (
    <div style={{ height: '100%' }}>
      <ReactQuill
        theme='snow'
        value={content}
        onChange={(value) => {
          setContent(value);
          console.log(value);
        }}
        modules={{ toolbar: toolbarOptions }}
        style={{ height: '80%', borderRadius: '8px' }}
      />
    </div>
  );
};

export default Editor;
