export default function CategoryPill({ name, active=false, onClick }){
  return (
    <button onClick={onClick} className={`btn btn-sm me-2 ${active? 'btn-primary':'btn-outline-light'}`}>{name}</button>
  )
}