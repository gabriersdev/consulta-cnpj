import PropTypes from "prop-types";
import moment from 'moment-timezone';
import {useCallback, useEffect, useState} from "react";

export default function UpdateTime({time}) {
  // Força a interpretação do `time` como UTC-3 (ex: São Paulo)
  const momentTime = moment.tz(time, 'America/Sao_Paulo');
  
  const [formattedTime, setFormattedTime] = useState("pouco");
  
  const intervalFn = useCallback(() => {
    const momentNow = moment.tz('America/Sao_Paulo');
    
    const seconds = momentNow.diff(momentTime, "seconds");
    const minutes = momentNow.diff(momentTime, "minutes");
    let hours = momentNow.diff(momentTime, "hours");
    
    // Implementação para forçar a apresentação de horário correto em produção
    hours = window.location.hostname === "localhost" ? hours : hours - 3;
    // Se o horário for menor que 4 horas, os minutos serão exibidos e a hora não. Para corrigir isso, no ambiente de produção, é feita a divisão dos minutos por 60, resultando na quantidade de horas
    // As horas então, são apresentadas, ao invés dos minutos
    hours = window.location.hostname === "localhost" && minutes > 60 && hours < 4 ? Math.floor(minutes / 60) : hours
    
    if (hours > 0) setFormattedTime(`${hours} ${hours > 1 ? "horas" : "hora"}`);
    else if (minutes > 0) setFormattedTime(`${minutes} ${minutes > 1 ? "minutos" : "minuto"}`);
    else if (seconds > 0) setFormattedTime(`${seconds} ${seconds > 1 ? "segundos" : "segundo"}`);
    else setFormattedTime("pouco");
  }, [momentTime]);
  
  useEffect(() => {
    intervalFn();
    const interval = setInterval(intervalFn, 1000);
    return () => clearInterval(interval);
  }, [intervalFn]);
  
  return <>{formattedTime}</>
}

UpdateTime.propTypes = {
  time: PropTypes.string.isRequired,
};
