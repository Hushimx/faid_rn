import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import TicketApis from 'services/tickets';
import { ICreateTicketPayload, TicketPriority } from 'types';
import { ShowSnackBar } from 'utils';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from 'store';
import { useNavigation } from '@react-navigation/native';

export const useCreateTicketController = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [errors, setErrors] = useState<{
    subject?: string;
    description?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { subject?: string; description?: string } = {};

    if (!subject || subject.trim().length < 5) {
      newErrors.subject = t('subjectMustBeAtLeast5Characters');
    } else if (subject.length > 255) {
      newErrors.subject = t('subjectMustNotExceed255Characters');
    }

    if (!description || description.trim().length < 10) {
      newErrors.description = t('descriptionMustBeAtLeast10Characters');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createTicketMutation = useMutation({
    mutationFn: (data: ICreateTicketPayload) => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return TicketApis.createTicket(data, user.id);
    },
    onSuccess: (response: any) => {
      ShowSnackBar(t('ticketCreatedSuccessfully'), 'success');
      navigation.goBack();
      // Optionally navigate to the created ticket
      // const ticket = dataExtractor<ITicket>(response);
      // if (ticket) {
      //   navigation.navigate('TicketDetail', { ticketId: ticket.id });
      // }
    },
    onError: (error: any) => {
      console.log('Create ticket error:', error);
      console.log('Error response:', error?.response);
      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.data?.error ||
        error?.message || 
        t('error');
      console.log('Error message:', errorMessage);
      ShowSnackBar(errorMessage, 'danger');
      
      // Handle rate limiting errors
      if (errorMessage.includes('Rate limit')) {
        setErrors({
          subject: errorMessage,
        });
      }
    },
  });

  const handleSubmit = () => {
    console.log('Create ticket - handleSubmit called');
    console.log('Subject:', subject);
    console.log('Description:', description);
    console.log('User ID:', user?.id);
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    if (!user?.id) {
      console.log('User ID missing');
      ShowSnackBar(t('pleaseLoginToCreateTicket') || 'Please login to create a ticket', 'danger');
      return;
    }

    console.log('Creating ticket...');
    createTicketMutation.mutate({
      subject: subject.trim(),
      description: description.trim(),
      priority,
    });
  };

  return {
    subject,
    setSubject,
    description,
    setDescription,
    priority,
    setPriority,
    errors,
    handleSubmit,
    isSubmitting: createTicketMutation.isPending,
  };
};

