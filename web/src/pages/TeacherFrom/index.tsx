import React,{useState, FormEvent} from 'react';
import {useHistory} from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

import warningIcon from '../../assets/images/icons/warning.svg';
import Input from '../../components/Input';
import './styles.css';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import api from '../../services/api';

const TeacherForm = () => {
    const history = useHistory();
    const [scheduleItems, setScheduleItems] = useState([{week_day: 0,from: '',to: ''}]);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [bio, setBio] = useState('');
    const [subject, setSubject] = useState('');
    const [cost, setCost] = useState('');

    const addNewScheduleItem = () => {
        setScheduleItems([
            ...scheduleItems,
            {week_day: 0,from: '',to: ''}
        ])
    }
    
    const handleCreateClass = (e: FormEvent) => {
        e.preventDefault();

        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems,
        }).then(() => {
            alert('Cadastro realizado com sucesso!');
            history.push('/')
        }).catch(() => {
            alert('Ero ao realizar cadastro! Tente novamente mais tarde.');
        })
    }

    const setScheduleItemValue = (position: number, field: string, value: string) =>{
        const updatedScheduleItems = scheduleItems.map((scheduleItem, index) =>{
            if(index === position){
                return { ...scheduleItem, [field]: value}
            }

            return scheduleItem;
        })

        setScheduleItems(updatedScheduleItems);
    }
    return(
       <div id="page-teacher-form" className="container">
           <PageHeader title="Que incrível que você quer dar aulas."
             description="O primeiro passo é preecher esse formulário de inscrição"   
           />

           <main>
               <form onSubmit={handleCreateClass}>
                    <fieldset>
                            <legend>Seus dados</legend>
                            <Input name="name" label="Nome completo"
                                value={name} onChange={(e) =>{setName(e.target.value)}}/>
                            <Input name="avatar" label="Avatar"
                                value={avatar} onChange={(e) =>{setAvatar(e.target.value)}}/>
                            <Input name="whatsapp" label="WhatsApp"
                                value={whatsapp} onChange={(e) =>{setWhatsapp(e.target.value)}}/>
                            <Textarea name="bio" label="Biografia"
                                value={bio} onChange={(e) =>{setBio(e.target.value)}}/>
                    </fieldset>

                    <fieldset>
                            <legend>Sobre a aula</legend>
                            <Select value={subject} onChange={(e) =>{setSubject(e.target.value)}}
                            name="subject" label="Matéria" options={[
                                {value: 'Matemática', label: 'Matemática'},
                                {value: 'Física', label: 'Física'},
                                {value: 'Artes', label: 'Artes'},
                                {value: 'Biologia', label: 'Biologia'},
                                {value: 'Ciências', label: 'Ciências'},
                                {value: 'Educação Física', label: 'Educação Física'},
                                {value: 'Geografia', label: 'Geografia'},
                                {value: 'História', label: 'História'},
                                {value: 'Português', label: 'Português'},
                                {value: 'Química', label: 'Química'},
                                {value: 'Redação', label: 'Redação'},
                                {value: 'Literatura', label: 'Literatura'},
                            ]}/>
                            <Input name="cost" label="Custo da sua hora por aula"
                            value={cost} onChange={(e) =>{setCost(e.target.value)}}/>
                    </fieldset>
                    <fieldset>
                        <legend>
                                Horários disponíveis
                                <button type="button" onClick={addNewScheduleItem}>+ Novo horário</button>
                        </legend>

                        {scheduleItems.map((shceduleItem, index) => {
                            return(
                                <div key={shceduleItem.week_day} className="schedule-item">
                                <Select name="week_day" label="Dia da semana"
                                value={shceduleItem.week_day}
                                onChange={(e) => setScheduleItemValue(index, 'week_day', e.target.value)}
                                options={[
                                        {value: '0', label: 'Domingo'},
                                        {value: '1', label: 'Segunda-feira'},
                                        {value: '2', label: 'Terça-feira'},
                                        {value: '3', label: 'Quarta-feira'},
                                        {value: '4', label: 'Quinta-feira'},
                                        {value: '5', label: 'Sexta-feira'},
                                        {value: '6', label: 'Sábado'},
                                    ]}/>
                                <Input name="from" label="Das" type="time" value={shceduleItem.from}
                                onChange={(e) => setScheduleItemValue(index, 'from', e.target.value)}/>
                                <Input name="to" label="Até" type="time" value={shceduleItem.to}
                                onChange={(e) => setScheduleItemValue(index, 'to', e.target.value)}/>
                            </div>
                            )
                        })}
                    </fieldset>
                    <footer>
                        <p>
                        <img src={warningIcon} alt="Aviso Importante"/>
                        Importante! <br/>
                        Preencha todos os dados
                        </p>
                        <button type="submit">
                        Salvar cadastro
                        </button>
                    </footer>
               </form>
           </main>
       </div>
    )
}

export default TeacherForm;