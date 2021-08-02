import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { db } from '../firebase';
import { useRouter } from 'next/dist/client/router';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { useSession } from 'next-auth/client';
import { useDocument, useDocumentOnce } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  }
);

function TextEditor() {
  const [session] = useSession();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const { id } = router.query;
  const [tCharacter, setTCharacter] = useState(Number);

  const getCurrentTotalCharacter = (eS) => {
    const raw = convertToRaw(eS.getCurrentContent());
    let total = 0;

    raw.blocks.map((block) => {
      total = total + block.text.length;
    });

    return total;
  };

  const totalCharacter = (raw) => {
    let total = 0;

    raw?.blocks.map((block) => {
      total = total + block.text.length;
    });

    return total;
  };

  const [snapshot] = useDocumentOnce(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const [totalSnapshot] = useDocument(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  );

  useEffect(() => {
    setTCharacter(totalCharacter(totalSnapshot?.data()?.editorState));
  }, [totalSnapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    if (getCurrentTotalCharacter(editorState) !== tCharacter) {
      db.collection('userDocs')
        .doc(session.user.email)
        .collection('docs')
        .doc(id)
        .set(
          {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            upToDate: false,
          },
          {
            merge: true,
          }
        );
    } else if (getCurrentTotalCharacter(editorState) === tCharacter) {
      db.collection('userDocs')
        .doc(session.user.email)
        .collection('docs')
        .doc(id)
        .set(
          {
            upToDate: true,
          },
          {
            merge: true,
          }
        );
    }

    db.collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .doc(id)
      .set(
        {
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        {
          merge: true,
        }
      );
  };

  return (
    <div className='bg-[#F8F9FA] min-h-screen pb-16'>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName='flex sticky top-[71px] z-50 !justify-center mx-auto'
        editorClassName='mt-6 p-20 bg-white shadow-lg max-w-5xl mx-auto mb-12 border'
      />
    </div>
  );
}

export default TextEditor;
