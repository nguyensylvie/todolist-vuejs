<template>
  <div
    class="d-flex scrollable overflow-x-auto fill-height pb-16"
    :style="bgStyle"
  >
    <div v-for="(todoList, todoListIndex) in todoLists" :key="todoListIndex">
      <v-card
        color="bg"
        width="350"
        max-width="350"
        :theme="themeMode"
        variant="flat"
        class="ma-5"
        :title="todoList.title"
        elevation="5"
      >
        <template v-slot:append>
          <div class="me-n2">
            <v-btn
              icon="$close"
              density="comfortable"
              variant="plain"
              @click="deleteTodoList(todoListIndex)"
            ></v-btn>
          </div>
        </template>

        <v-card
          class="ma-4"
          color="bgTask"
          rounded="lg"
          variant="flat"
          v-for="(task, taskIndex) in todoList.tasks"
          :key="taskIndex"
        >
          <v-card-item>
            <v-card-title class="text-body-2 d-flex">
              <div class="text-h6 pre-line">
                {{ task.title }}
              </div>
              <v-spacer></v-spacer>
              <v-btn
                icon="$close"
                size="small"
                variant="text"
                @click="deleteTask(taskIndex, todoListIndex)"
              ></v-btn>
            </v-card-title>
            <div class="py-2" v-show="task.description">
              <div class="font-weight-light text-medium-emphasis pre-line">
                {{ task.description }}
              </div>
            </div>
          </v-card-item>
        </v-card>

        <v-card-actions v-if="!todoList.showForm">
          <v-btn prepend-icon="mdi-plus" @click="toggleTaskForm(todoListIndex)">
            <template v-slot:prepend>
              <v-icon></v-icon>
            </template>
            Ajouter une tâche
          </v-btn>
        </v-card-actions>
        <form v-if="todoList.showForm" @submit.prevent="addTask(todoListIndex)">
          <div class="ma-4">
            <v-text-field
              v-model.trim="newTaskTitle"
              label="Titre"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model.trim="newTaskDescription"
              label="Description"
            ></v-text-field>
            <v-btn class="me-2" type="submit" :disabled="isDisabledNewTask">
              Ajouter
            </v-btn>
            <v-btn @click="cancelNewTask(todoListIndex)"> Annuler </v-btn>
          </div>
        </form>
      </v-card>
    </div>

    <div>
      <v-card
        color="bg"
        width="300"
        :theme="themeMode"
        variant="flat"
        class="ma-5"
        elevation="5"
      >
        <v-card-actions v-if="!showFormTodoList">
          <v-btn prepend-icon="mdi-plus" @click="showFormTodoList = true">
            <template v-slot:prepend>
              <v-icon></v-icon>
            </template>
            Ajouter une liste
          </v-btn>
        </v-card-actions>
        <form v-if="showFormTodoList" @submit.prevent="addTodoList">
          <div class="ma-4">
            <v-text-field
              v-model.trim="newTodoListTitle"
              label="Titre"
              autofocus
            ></v-text-field>
            <v-btn class="me-2" type="submit" :disabled="isDisabledNewTodoList">
              Ajouter
            </v-btn>
            <v-btn @click="cancelNewTodoList"> Annuler </v-btn>
          </div>
        </form>
      </v-card>
    </div>
    <toggle-theme-btn
      :toggleTheme="toggleTheme"
      :theme="theme"
      :themeMode="themeMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import ToggleThemeBtn from "./ToggleThemeBtn.vue";
import { TodoList } from "../types";

let todoLists = reactive<TodoList[]>([
  {
    title: "A faire",
    tasks: [
      {
        title: "Projet",
        description: "Application vuejs",
      },
      {
        title: "Sport",
        description: "Exercices 30min",
      },
      {
        title: "Rangement",
        description: "",
      },
    ],
    showForm: false,
  },
  {
    title: "En cours",
    tasks: [
      {
        title: "CV",
        description: "Mettre à jour",
      },
    ],
    showForm: false,
  },
  {
    title: "Terminer",
    tasks: [],
    showForm: false,
  },
]);

const theme = ref<boolean>(true);
const showFormTodoList = ref<boolean>(false);
const newTodoListTitle = ref<string>("");
const newTaskTitle = ref<string>("");
const newTaskDescription = ref<string>("");
const isDialogVisible = ref<boolean>(false);

const bgStyle = computed(() => ({
  backgroundImage: `url(${
    theme.value ? "../assets/bgLight.png" : "../assets/bgDark.png"
  })`,
  backgroundRepeat: "repeat",
  backgroundColor: `${theme.value ? "#EEEEEE" : "#202225"}`,
}));

const themeMode = computed(() => (theme.value ? "light" : "dark"));

const toggleTheme = () => {
  theme.value = !theme.value;
};

//Functions todolist

const isDisabledNewTodoList = computed(
  () => newTodoListTitle.value.trim() === ""
);

const addTodoList = () => {
  if (newTodoListTitle.value !== "") {
    todoLists.push({
      title: newTodoListTitle.value,
      tasks: [],
      showForm: false,
    });
    newTodoListTitle.value = "";
    showFormTodoList.value = false;
  }
};

const cancelNewTodoList = () => {
  showFormTodoList.value = false;
  newTodoListTitle.value = "";
};

const deleteTodoList = (listIndex: number) => {
  todoLists.splice(listIndex, 1);
  isDialogVisible.value = false;
};

// Functions task

const isDisabledNewTask = computed(() => newTaskTitle.value.trim() === "");

const addTask = (listIndex: number) => {
  if (newTaskTitle.value !== "") {
    const activeList = todoLists[listIndex];
    if (activeList) {
      activeList.tasks.push({
        title: newTaskTitle.value,
        description: newTaskDescription.value,
      });
    }
    newTaskTitle.value = "";
    newTaskDescription.value = "";
    activeList.showForm = false;
  }
};

const cancelNewTask = (listIndex: number) => {
  const activeList = todoLists[listIndex];
  activeList.showForm = false;
  newTaskTitle.value = "";
  newTaskDescription.value = "";
};

const deleteTask = (taskIndex: number, listIndex: number) => {
  const activeList = todoLists[listIndex];
  if (activeList) {
    activeList.tasks.splice(taskIndex, 1);
  }
};

const toggleTaskForm = (listIndex: number) => {
  newTaskTitle.value = "";
  newTaskDescription.value = "";
  for (let i = 0; i < todoLists.length; i++) {
    if (i !== listIndex) {
      todoLists[listIndex].showForm = false;
    }
    if ((todoLists[i].showForm = true)) {
      todoLists[i].showForm = false;
    }
  }
  todoLists[listIndex].showForm = !todoLists[listIndex].showForm;
};
</script>

<script lang="ts">
export default {
  name: "TodoList",
};
</script>

<style>
.pre-line {
  white-space: pre-line;
}

input:focus {
  outline: none;
}

.v-btn {
  text-transform: none;
}
</style>
