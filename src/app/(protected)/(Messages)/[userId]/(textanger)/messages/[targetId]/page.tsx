
const chatPage = ({params}:{params:{targetId: string}}) => {
    return (
        <>
        <h1 className="text-2xl font-bold mb-4 text-white">Messages</h1>
        <div className="message-content text-white">Selected <p>{params.targetId}</p></div>
        </>
    )
}

export default chatPage;