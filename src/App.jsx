// App.jsx / App.tsx

import React, { Component } from "react";

import { CKEditor } from "@ckeditor/ckeditor5-react";

// NOTE: Use the editor from source (not a build)!
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { AutoLink, Link } from "@ckeditor/ckeditor5-link";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import { List } from "@ckeditor/ckeditor5-list";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
import { Undo } from "@ckeditor/ckeditor5-undo";
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageResizeButtons,
} from "@ckeditor/ckeditor5-image";

const editorConfiguration = {
  plugins: [
    Essentials,
    Bold,
    Italic,
    Paragraph,
    CodeBlock,
    Heading,
    AutoLink,
    Link,
    Autoformat,
    List,
    BlockQuote,
    Indent,
    IndentBlock,
    Table,
    TableToolbar,
    Undo,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResizeEditing,
    ImageResizeHandles,
    ImageResizeButtons,
  ],
  extraPlugins: [MyCustomUploadAdapterPlugin],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "codeBlock",
    "blockQuote",
    "indent",
    "outdent",
    "insertTable",
    "|",
    "undo",
    "redo",
    "|",
    "imageUpload",
    "imageStyle:inline",
    "imageStyle:alignLeft",
    "imageStyle:alignRight",
    "imageStyle:alignCenter",
    "imageStyle:alignBlockLeft",
    "imageStyle:alignBlockRight",
  ],
  image: {
    resizeOptions: [
      {
        name: "resizeImage:original",
        value: null,
        icon: "original",
      },
      {
        name: "resizeImage:50",
        value: "50",
        icon: "medium",
      },
      {
        name: "resizeImage:75",
        value: "75",
        icon: "large",
      },
    ],
    toolbar: [
      "resizeImage:50",
      "resizeImage:75",
      "resizeImage:original",
      // More toolbar options.
      // ...
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  link: {
    addTargetToExternalLinks: true,
  },
};
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const cloudName = "hireg";
          const unsignedUploadPreset = "rwjokdvu";
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", unsignedUploadPreset);
          data.append("max_width", 3000);
          data.append("folder", "UserUploads");
          fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            body: data,
            header: {
              "X-Requested-With": "XMLHttpRequest",
            },
            method: "POST",
          })
            .then((response) => {
              return response.json();
            })
            .then((file) => {
              const resData = file;
              resData.default = file.url;
              resolve(resData);
            });
        })
    );
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!

    console.log(Array.from(editor.ui.componentFactory.names));
    return new MyUploadAdapter(loader);
  };
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Using CKEditor 5 from source in React</h2>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data="<p>Hello from CKEditor 5!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    );
  }
}

export default App;
