import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { ProposalData } from '../types';

export interface SavedProposal {
  id: string;
  userId: string;
  title: string;
  clientName: string;
  clientCompany?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: any;
  updatedAt: any;
  data: ProposalData;
  template: string;
  pdfUrl?: string;
}

class ProposalService {
  private collectionName = 'proposals';

  async saveProposal(userId: string, proposalData: ProposalData, template: string): Promise<string> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Database not configured. Please set up Firebase to save proposals.');
    }
    
    try {
      const proposal: Omit<SavedProposal, 'id'> = {
        userId,
        title: proposalData.project.title,
        clientName: proposalData.client.name,
        clientCompany: proposalData.client.company,
        amount: proposalData.project.price,
        currency: proposalData.project.currency,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        data: proposalData,
        template
      };

      const docRef = await addDoc(collection(db, this.collectionName), proposal);
      return docRef.id;
    } catch (error) {
      console.error('Error saving proposal:', error);
      throw new Error('Failed to save proposal');
    }
  }

  async updateProposal(proposalId: string, proposalData: ProposalData, template: string): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Database not configured');
    }
    
    try {
      const proposalRef = doc(db, this.collectionName, proposalId);
      await updateDoc(proposalRef, {
        title: proposalData.project.title,
        clientName: proposalData.client.name,
        clientCompany: proposalData.client.company,
        amount: proposalData.project.price,
        currency: proposalData.project.currency,
        updatedAt: serverTimestamp(),
        data: proposalData,
        template
      });
    } catch (error) {
      console.error('Error updating proposal:', error);
      throw new Error('Failed to update proposal');
    }
  }

  async deleteProposal(proposalId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Database not configured');
    }
    
    try {
      await deleteDoc(doc(db, this.collectionName, proposalId));
    } catch (error) {
      console.error('Error deleting proposal:', error);
      throw new Error('Failed to delete proposal');
    }
  }

  async getUserProposals(userId: string): Promise<SavedProposal[]> {
    if (!isFirebaseConfigured || !db) {
      return []; // Return empty array if not configured
    }
    
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SavedProposal));
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw new Error('Failed to fetch proposals');
    }
  }

  async getProposal(proposalId: string): Promise<SavedProposal | null> {
    if (!isFirebaseConfigured || !db) {
      return null;
    }
    
    try {
      const docRef = doc(db, this.collectionName, proposalId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as SavedProposal;
      }
      return null;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      throw new Error('Failed to fetch proposal');
    }
  }

  async updateProposalStatus(proposalId: string, status: SavedProposal['status']): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Database not configured');
    }
    
    try {
      const proposalRef = doc(db, this.collectionName, proposalId);
      await updateDoc(proposalRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating proposal status:', error);
      throw new Error('Failed to update proposal status');
    }
  }

  async duplicateProposal(proposalId: string, userId: string): Promise<string> {
    try {
      const originalProposal = await this.getProposal(proposalId);
      if (!originalProposal) {
        throw new Error('Proposal not found');
      }

      // Create a copy with updated title and reset status
      const duplicatedData = {
        ...originalProposal.data,
        project: {
          ...originalProposal.data.project,
          title: `${originalProposal.data.project.title} (Copy)`
        }
      };

      return await this.saveProposal(userId, duplicatedData, originalProposal.template);
    } catch (error) {
      console.error('Error duplicating proposal:', error);
      throw new Error('Failed to duplicate proposal');
    }
  }
}

export const proposalService = new ProposalService();