// src/services/PredictiveSearchService.ts
import { ProfileStudentService } from './ProfileStudentService';
import { ProfileTeacherService } from './ProfileTeacherService';
import { MaterialBaseService } from './MaterialBaseService';
import type { PredictiveSuggestion, PredictiveSearchOptions } from '@/types/predictive-search.types';

export class PredictiveSearchService {
  private static instance: PredictiveSearchService;
  private cache: Map<string, { data: PredictiveSuggestion[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private abortController: AbortController | null = null;

  private constructor() {}

  public static getInstance(): PredictiveSearchService {
    if (!PredictiveSearchService.instance) {
      PredictiveSearchService.instance = new PredictiveSearchService();
    }
    return PredictiveSearchService.instance;
  }

  /**
   * Búsqueda predictiva principal - ÚNICO MÉTODO PÚBLICO
   */
  async predictiveSearch(
    query: string,
    options: PredictiveSearchOptions = {}
  ): Promise<PredictiveSuggestion[]> {
    // Validación
    if (!query || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Verificar caché
    const cached = this.getFromCache(normalizedQuery);
    if (cached) {
      return cached;
    }

    // Cancelar búsqueda anterior
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      const suggestions: PredictiveSuggestion[] = [];
      const {
        includeStudents = true,
        includeTeachers = true,
        includeMaterials = true,
        maxResults = 10
      } = options;

      // Búsquedas paralelas
      const promises: Promise<PredictiveSuggestion[]>[] = [];

      if (includeStudents) {
        promises.push(this.searchStudents(normalizedQuery));
      }

      if (includeTeachers) {
        promises.push(this.searchTeachers(normalizedQuery));
      }

      if (includeMaterials) {
        promises.push(this.searchMaterials(normalizedQuery));
      }

      const results = await Promise.all(promises);
      
      // Combinar y ordenar por score
      results.forEach(result => suggestions.push(...result));
      suggestions.sort((a, b) => b.score - a.score);

      // Limitar resultados
      const limitedSuggestions = suggestions.slice(0, maxResults);

      // Guardar en caché
      this.saveToCache(normalizedQuery, limitedSuggestions);

      return limitedSuggestions;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Búsqueda predictiva cancelada');
        return [];
      }
      console.error('Error en búsqueda predictiva:', error);
      throw error;
    }
  }

  /**
   * MÉTODO PRIVADO: Búsqueda de estudiantes
   */
  private async searchStudents(query: string): Promise<PredictiveSuggestion[]> {
    try {
      const studentService = ProfileStudentService.getInstance();
      const students = await studentService.searchStudentsByName(query);

      return students.slice(0, 4).map(student => ({
        id: student.uid,
        type: 'student',
        title: student.displayName,
        subtitle: student.email,
        description: student.grade ? `${student.grade} - ${student.group}` : '',
        icon: '👨‍🎓',
        score: this.calculateScore(query, student.displayName),
        data: student
      }));

    } catch (error) {
      console.error('Error buscando estudiantes:', error);
      return [];
    }
  }

  /**
   * MÉTODO PRIVADO: Búsqueda de profesores
   */
  private async searchTeachers(query: string): Promise<PredictiveSuggestion[]> {
    try {
      const teacherService = ProfileTeacherService.getInstance();
      const teachers = await teacherService.searchTeachersByName(query);

      return teachers.slice(0, 3).map(teacher => ({
        id: teacher.uid,
        type: 'teacher',
        title: teacher.displayName,
        subtitle: teacher.email,
        description: teacher.area || '',
        icon: '👨‍🏫',
        score: this.calculateScore(query, teacher.displayName),
        data: teacher
      }));

    } catch (error) {
      console.error('Error buscando profesores:', error);
      return [];
    }
  }

  /**
   * MÉTODO PRIVADO: Búsqueda de materiales
   */
  private async searchMaterials(query: string): Promise<PredictiveSuggestion[]> {
    try {
      const materialService = MaterialBaseService.getInstance();
      const materials = await materialService.searchMaterials({
        searchTerm: query,
        sortBy: 'relevance'
      });

      return materials.slice(0, 3).map(material => ({
        id: material.id,
        type: 'material',
        title: material.title,
        subtitle: material.category,
        description: material.subject,
        icon: '📄',
        score: this.calculateScore(query, material.title),
        data: material
      }));

    } catch (error) {
      console.error('Error buscando materiales:', error);
      return [];
    }
  }

  /**
   * MÉTODO PRIVADO: Calcular score de relevancia
   */
  private calculateScore(query: string, text: string): number {
    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (normalizedText === normalizedQuery) return 100;
    if (normalizedText.startsWith(normalizedQuery)) return 90;
    if (normalizedText.includes(normalizedQuery)) return 70;

    // Coincidencia de palabras
    const queryWords = normalizedQuery.split(' ');
    const textWords = normalizedText.split(' ');
    
    let matchCount = 0;
    queryWords.forEach(qWord => {
      if (textWords.some(tWord => tWord.includes(qWord))) {
        matchCount++;
      }
    });

    return (matchCount / queryWords.length) * 50;
  }

  /**
   * MÉTODO PRIVADO: Obtener del caché
   */
  private getFromCache(key: string): PredictiveSuggestion[] | null {
    const cached = this.cache.get(key);
    
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
      if (!isExpired) {
        return cached.data;
      }
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * MÉTODO PRIVADO: Guardar en caché
   */
  private saveToCache(key: string, data: PredictiveSuggestion[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Limitar tamaño del caché
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  /**
   * ÚNICO OTRO MÉTODO PÚBLICO: Limpiar caché
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default PredictiveSearchService.getInstance();