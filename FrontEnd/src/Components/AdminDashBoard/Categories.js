import "./Categories.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AddCategory } from "./AddCategory";
import { useState } from "react";

const categories = [
  {
    id: 2,
    name: "Monitors",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751909449/monitor-16_iqfkww.png",
  },
  {
    id: 3,
    name: "Keyboards",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751911350/keyboard-15_pzluxo.png",
  },
  {
    id: 4,
    name: "PC Gamers",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751884889/pc-gamer9_lk6v8c.png",
  },
  {
    id: 5,
    name: "Laptops",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751912952/laptop-14_ieu1ch.png",
  },
  {
    id: 6,
    name: "Playstations",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751968911/playstation-13_n1vz9z.png",
  },
  {
    id: 7,
    name: "Xbox consoles",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751970123/xbox-10_c5umi9.png",
  },
  {
    id: 8,
    name: "Gamepads",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751971401/gamepad-14_htjyz5.png",
  },
  {
    id: 9,
    name: "Headsets",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751972534/headset-19_egtpqy.png",
  },
  {
    id: 10,
    name: "Mousepads",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751974173/mousepad-2_kuxwyh.png",
  },
  {
    id: 11,
    name: "Graphics Cards(GPUs)",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1751975924/gpu-2_s91xxl.png",
  },
  {
    id: 12,
    name: "Processors(CPUs)",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752055649/cpu-3_hg0ihx.png",
  },
  {
    id: 13,
    name: "RAMs",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752056866/ram-6_u2rpiy.png",
  },
  {
    id: 14,
    name: "SSDs & Storage",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752058119/storage-16_xlevos.png",
  },
  {
    id: 17,
    name: "Chairs",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752059441/chair-4_pphrym.png",
  },
  {
    id: 18,
    name: "Desks",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752060679/desk-5_c6bgvh.png",
  },
  {
    id: 20,
    name: "LED Light Strips",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752062101/light-2_gxbaqu.png",
  },
  {
    id: 21,
    name: "Mouse",
    imagePath:
      "https://res.cloudinary.com/dzgnc3hc0/image/upload/v1752065213/mouse-4_qj6czd.png",
  },
];

export function Categories() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenDialog = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };
  function handleAddCategory() {
    setShowAddCategoryDialog(true);
    setSelectedCategory(null);
  }
  function handleUpdateCategory(category) {
    setShowAddCategoryDialog(true);
    setSelectedCategory(category);
  }
  return (
    <div className="categories-page">
      <header className="d-flex justify-content-between align-items-center flex-wrap my1 gap-2">
        <div>
          <h3 className="categories-section-title">Categories</h3>
        </div>
        <Button
          id="add-category-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
        >
          add category
        </Button>
      </header>
      <section className="categories-table mt-4">
        <TableContainer className="table-container styled-scrollbar">
          <Table
            style={{ minWidth: 600 }}
            className="styled-table"
            aria-label="table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">IMG Path</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.imagePath}</TableCell>

                  <TableCell className="d-flex flex-nowrap gap-1" align="left">
                    <IconButton onClick={() => handleUpdateCategory(c)}>
                      <EditIcon className="icon edit" />
                    </IconButton>
                    <IconButton onClick={handleOpenDialog}>
                      <DeleteIcon className="icon delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
      {/* delete product dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Category? This action cannot be
            undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* ================ */}
      {/* add category dialog */}
      {showAddCategoryDialog && (
        <AddCategory
          setOpen={setShowAddCategoryDialog}
          category={selectedCategory}
        />
      )}
      {/* ================ */}
    </div>
  );
}
