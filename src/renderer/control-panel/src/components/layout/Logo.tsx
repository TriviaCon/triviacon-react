const Logo: React.FC<{ bg?: string }> = ({ bg = 'black' }) => {
  return (
    <div style={{ backgroundColor: bg }} className="rounded px-1">
      <h4 className="text-center mb-0">
        <span className="text-white">Trivia</span>
        <span
          className="font-bold"
          style={{
            background:
              'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          CON
        </span>
      </h4>
    </div>
  )
}

export default Logo
