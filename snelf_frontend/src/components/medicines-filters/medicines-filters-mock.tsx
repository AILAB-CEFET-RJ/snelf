import { Button, TextField } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FilterType } from "../../types/types";

interface MedicinesFiltersProps {
  onFilter: (filters: FilterType) => void;
}

export const MedicinesFilters = ({ onFilter }: MedicinesFiltersProps) => {
  const { control, handleSubmit } = useForm<FilterType>({
    defaultValues: {
      clean: "",
      descricaoProduto: "",
      unidadeComercial: "",
      quantidade: "",
      valorUnitarioComercial: "",
    },
  });

  const onSubmit: SubmitHandler<FilterType> = (data) => {
    onFilter(data); // Apenas chama a função que aplica os filtros no frontend
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <div className="input-area" style={{ display: "flex", gap: 10 }}>
        <Controller
          name="clean"
          control={control}
          render={({ field }) => <TextField {...field} label="Clean" />}
        />
        <Controller
          name="descricaoProduto"
          control={control}
          render={({ field }) => <TextField {...field} label="Descrição" />}
        />
        <Controller
          name="unidadeComercial"
          control={control}
          render={({ field }) => <TextField {...field} label="Unidade" />}
        />
        <Controller
          name="quantidade"
          control={control}
          render={({ field }) => <TextField {...field} label="Quantidade" />}
        />
        <Controller
          name="valorUnitarioComercial"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Valor unitário" />
          )}
        />
      </div>

      <Button
        type="submit"
        variant="contained"
        sx={{ justifySelf: "center", alignSelf: "center" }}
      >
        Filtrar
      </Button>
    </form>
  );
};
