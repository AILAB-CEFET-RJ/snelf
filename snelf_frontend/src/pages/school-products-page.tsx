import useStore from "../core/mobx/use-store";
import { observer } from "mobx-react-lite";
import { MedicinesFilters } from "../components/medicines-filters/medicines-filters-mock";
import { useEffect, useState } from "react";
import Table from "../components/TableMock";

export const SchoolProductsPage = observer(() => {
  const { schoolProductsStore } = useStore();
  const { rows } = schoolProductsStore || {};
  const [filteredRows, setFilteredRows] = useState<string[][]>([]);
  const transformColumn = ["Clean", "Descricao", "Grupo", "Quantidade", "Valor Unitário"];

  const transformRows = (rows: any) => {
    if (!rows || !Array.isArray(rows)) return [];
    return rows.map((row) => [
      row.CLEAN?.toString() || "",
      row.DescricaoProduto || "",
      row.unidadecomercial || "",
      row.quantidadecomercial?.toString() || "",
      row.valorunitariocomercial?.toString() || "",
    ]);
  };

  useEffect(() => {
    const fetch = async () => {
      console.log("Fetching data...");
      await schoolProductsStore.loadTableRows({});
      setFilteredRows(transformRows(schoolProductsStore.rows));
    };

    if (schoolProductsStore) {
      fetch();
    }
  }, []);

  // Função para aplicar os filtros localmente
  const handleFilter = (filters: any) => {
    const filtered = transformRows(rows).filter((row) => {
      return (
        (!filters.clean || (row[0] && row[0].toLowerCase().includes(filters.clean.toLowerCase()))) &&
        (!filters.descricaoProduto || (row[1] && row[1].toLowerCase().includes(filters.descricaoProduto.toLowerCase()))) &&
        (!filters.unidadeComercial || (row[2] && row[2].toLowerCase().includes(filters.unidadeComercial.toLowerCase()))) &&
        (!filters.quantidade || (row[3] && parseInt(row[3]) === parseInt(filters.quantidade))) &&
        (!filters.valorUnitarioComercial || (row[4] && parseFloat(row[4]) === parseFloat(filters.valorUnitarioComercial)))
      );
    });    
    console.log(filters)
    setFilteredRows(filtered);
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          marginTop: 100,
          width: "80vw",
        }}
      >
        <MedicinesFilters onFilter={handleFilter} />
        <Table columns={transformColumn} rows={filteredRows} />
      </div>
    </div>
  );
});
