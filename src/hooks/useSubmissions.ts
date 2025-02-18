import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Submission = Database['public']['Tables']['submissions']['Row'];

export function useSubmissions(userId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    fetchSubmissions();
    
    // Subscribe to changes
    const channel = supabase
      .channel('submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubmissions((prev) => [...prev, payload.new as Submission]);
          } else if (payload.eventType === 'UPDATE') {
            setSubmissions((prev) =>
              prev.map((submission) =>
                submission.id === payload.new.id
                  ? (payload.new as Submission)
                  : submission
              )
            );
            
            // Show toast notification for status updates
            if (payload.old.status !== payload.new.status) {
              const message = `Task ${payload.new.task_id} was ${payload.new.status}`;
              if (payload.new.status === 'approved') {
                toast.success(message);
              } else if (payload.new.status === 'rejected') {
                toast.error(message);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      
      const query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }

  async function createSubmission(taskId: number, proof: string) {
    if (!userId) {
      toast.error('You must be logged in to submit tasks');
      return;
    }

    try {
      const { error } = await supabase.from('submissions').insert({
        user_id: userId,
        task_id: taskId,
        proof,
      });

      if (error) throw error;
      toast.success('Task submitted for review!');
    } catch (error) {
      console.error('Error creating submission:', error);
      toast.error('Failed to submit task');
      throw error;
    }
  }

  async function updateSubmissionStatus(
    submissionId: string,
    status: 'approved' | 'rejected'
  ) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', submissionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission status');
      throw error;
    }
  }

  return {
    submissions,
    loading,
    createSubmission,
    updateSubmissionStatus,
  };
}