import { useEffect, useState } from "react";
import { client } from "../../graphqlClient";
import { TODOS_VETERINARIOS_QUERY } from "./veterinarios.queries";
import {
  Veterinario,
  TodosLosVeterinariosResponse,
} from "./veterinarios.types";

export function useVeterinarios() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVeterinarios = async () => {
      try {
        const data = await client.request<TodosLosVeterinariosResponse>(
          TODOS_VETERINARIOS_QUERY
        );
        setVeterinarios(data.veterinarios);
      } catch (err) {
        setError("Error al cargar veterinarios");
      } finally {
        setLoading(false);
      }
    };
    fetchVeterinarios();
  }, []);

  return { veterinarios, loading, error };
}
