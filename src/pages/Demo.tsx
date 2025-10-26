import {useState, useImperativeHandle, useRef, type Ref} from "react";
import {Modal} from "@douyinfe/semi-ui";

interface MyModalActions {
	openModal: () => void;
}

const MyModal = ({ref}: { ref?: Ref<MyModalActions> }) => {
	const [visible, setVisible] = useState(false)
	const openModal = () => {
		setVisible(true)
	}
	const closeModal = () => {
		setVisible(false)
	}
	useImperativeHandle(ref, () => {
		return {
			openModal,
			closeModal
		}
	}, [])
	return (
		<Modal
			title="基本对话框"
			visible={visible}
			closeOnEsc={true}
			onCancel={closeModal}
		>
			This is the content of a basic modal.
			<br/>
			More content...
		</Modal>
	)
}

const TableEditor = () => {
	
	const modalRef = useRef<MyModalActions>(null)
	return (
		<>
			<>
				<button onClick={() => modalRef.current?.openModal()}>打开弹窗</button>
				<MyModal ref={modalRef}/>
			</>
		</>
	)
};

export default TableEditor;
