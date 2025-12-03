
import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from './firebase';
import { Inspection } from './types';

interface InspectionContextType {
  inspections: Inspection[];
  loading: boolean;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const InspectionProvider = ({ children }: PropsWithChildren) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const inspectionsRef = collection(db, 'inspections');
    const q = query(inspectionsRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inspectionsData: Inspection[] = [];
      querySnapshot.forEach((doc) => {
        inspectionsData.push({ id: doc.id, ...doc.data() } as Inspection);
      });
      setInspections(inspectionsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching inspections:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <InspectionContext.Provider value={{ inspections, loading }}>
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspections = () => {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspections must be used within an InspectionProvider');
  }
  return context;
};
