import style from "./Clima.module.scss"

/**
 * View pura — recibe el weather ya resuelto. Si es null/empty, no renderiza.
 * La data layer vive en cada app (portal: async server con fetch /api/weather,
 * CMS: client useEffect — o no se muestra si no hay endpoint).
 */
export default function ClimaView({ weather }) {
  if (!weather || !weather.current || !weather.hourly) return null

  const { current, hourly, city } = weather

  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.tempBlock}>
          <img
            src={`/icons/timeIcons/${current.icon}.svg`}
            alt={current.condition}
            className={style.mainIcon}
          />
          <span className={style.temp}>{current.temp}°</span>
        </div>
        <div className={style.info}>
          <span className={style.condition}>{current.condition}</span>
          <span className={style.city}>{city}</span>
        </div>
      </div>

      <div className={style.hourly}>
        {hourly.map((h) => (
          <div key={h.time} className={style.hourItem}>
            <span className={style.hourTime}>{h.time}</span>
            <img
              src={`/icons/timeIcons/${h.icon}.svg`}
              alt={h.condition ?? ''}
              className={style.hourIcon}
            />
            <span className={style.hourTemp}>{h.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
