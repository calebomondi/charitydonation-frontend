import NavBar from "../navbar/navbar"
import BookDetails from "../bookdetails/BookDetails"

export default function Donate() {
  return (
    <main>
      <NavBar />
      <div>
        <BookDetails bookId={3}/>
      </div>
    </main>
  )
}
